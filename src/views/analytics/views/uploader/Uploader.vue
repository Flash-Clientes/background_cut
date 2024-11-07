<template>
    <n-card class="home-container">

        <n-space class="main-container" justify="space-between" align="center" size="large">
        
            <n-space class="interation-content">
                
                <n-typography>
                <n-h1 class="title-text">
                    {{ t('pages.home.title') }}
                </n-h1>
                </n-typography>
                
                <n-typography>
                <n-text class="description-text">
                    Remova o fundo de suas imagens de forma fácil e rápida. Basta fazer o
                    upload da sua imagem abaixo.
                </n-text>
                </n-typography>
                
                <n-space class="uploader-container">
                <n-upload
                    :multiple="false"
                    :directory-dnd="true"
                    :show-upload-list="false"
                    @change="handleUploadChange"
                    accept="image/*"
                >
                    <n-upload-dragger v-if="!previewImageUrlRef">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                            <path 
                            stroke-linejoin="round" 
                            d="M4.382 8.813v8.5c0 .845.344 1.656.957 2.253a3.3 3.3 0 0 0 2.308.934h8.706c.866 0 1.696-.336 2.308-.934a3.15 3.15 0 0 0 .957-2.253v-8.5m0-5.313H4.382c-.901 0-1.632.714-1.632 1.594v2.125c0 .88.73 1.593 1.632 1.593h15.236c.901 0 1.632-.713 1.632-1.593V5.094c0-.88-.73-1.594-1.632-1.594"
                            />
                            <path stroke-miterlimit="10" d="M12 12v5" />
                            <path 
                            stroke-linejoin="round" 
                            d="m14.293 14.105l-1.967-1.967a.46.46 0 0 0-.652 0l-1.967 1.967"
                            />
                        </g>
                        </svg>
                    </div>
                    <n-text style="font-size: 16px">
                        Clique ou arraste e solte a imagem aqui para fazer o upload.
                    </n-text>
                    </n-upload-dragger>
                    <n-card v-else class="uploaded-image">
                    <img :src="previewImageUrlRef" alt="Imagem sem fundo" style="width: 100%" />
                    </n-card>
                </n-upload>
                </n-space>
                
            </n-space>

            <n-spin :show="isLoading">
                <n-space class="result-content">
                <n-image
                    class="resulted-image"
                    :src="resultImageUrlRef || 'https://res.cloudinary.com/prime-arte/image/upload/v1729012179/santander/yoovdchflputukmowums.png'"
                    alt="Imagem sem fundo"
                    width="400"
                />
                <n-button
                    v-if="resultImageUrlRef"
                    @click="downloadImage"
                >
                    Download
                </n-button>
                </n-space>
            </n-spin>
        
        </n-space>
    </n-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import useRegisterCustomization from './hooks/register-customization/useRegisterCustomization';

const { registerCustomization } = useRegisterCustomization();

const showCustomizationModal = ref(false);
const customizationModalData = ref(null);
const selectedCustomizations = ref([]);
const isLoading = ref(false);
const previewImageUrlRef = ref("");
const resultImageUrlRef = ref("");

const showToast = (message, type = "success") => {
  const color = type === "success" ? "#00a854" : "#c60d31";
  toast(message, {
    position: "top-center",
    autoClose: 5000,
    type,
    toastStyle: {
      "--toastify-icon-color-success": color,
      "--toastify-color-success": color,
    },
    progressStyle: {
      "--toastify-progress-bar-color-success": color,
    }
  });
};

const handlePasteUpload = async (event) => {
  const items = event.clipboardData?.items;
  if (items) {
    for (const item of items) {
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            previewImageUrlRef.value = reader.result;
          };
          reader.readAsDataURL(file);
          await handleUploadChange({ fileList: [{ file }] });
          break;
        }
      }
    }
  } else {
    showToast("Erro ao colar a imagem. Tente novamente.", "error");
  }	
};

const handleUploadChange = async ({ fileList }) => {
  if (!fileList.length) {
    previewImageUrlRef.value = "";
    return;
  }

  const file = fileList[0]?.file;
  if (!file) {
    previewImageUrlRef.value = "";
    showToast("Erro ao carregar a imagem. Tente novamente.", "error");
    return;
  }

  const fileSize = file.size / 1024 / 1024;
  if (fileSize > 12) {
    showToast("O tamanho da imagem não pode ser maior que 12MB.", "error");
    return;
  }

  isLoading.value = true;
  previewImageUrlRef.value = await uploadImageToCloudinary(file);
  await processImage(previewImageUrlRef.value);
  isLoading.value = false;
};

const processImage = async (imageUrl) => {
  const data = JSON.stringify({
    imageUrl,
    nameFile: `${Date.now()}.png`
  });

  try {
    const response = await axios.post("https://healthy-sideways-freeze.glitch.me/process-image", data, {
      headers: { "Content-Type": "application/json" }
    });
    
    resultImageUrlRef.value = response.data.imageUrl;

    const customizationToRegister = {
      imagem_personalizada: resultImageUrlRef.value,
      imagem_usuario: imageUrl,
      campanha: 'Remoção de Fundo',
      whatsapp: '5511999999999',
      empresa_id: '0'
    };

    await registerCustomization(customizationToRegister);
    showToast("Imagem sem fundo gerada com sucesso!");

  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    showToast("Erro ao processar a imagem. Tente novamente.", "error");
  }
};

const uploadImageToCloudinary = async (fileItem) => {
  const formData = new FormData();
  formData.append("file", fileItem);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data.secure_url;
};

const downloadImage = () => {
  fetch(resultImageUrlRef.value)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "image.png";
      link.click();
      URL.revokeObjectURL(blobUrl);
    })
    .catch(error => console.error("Erro ao baixar a imagem:", error));
};

const turnOnVM = async () => {
  try {
    await axios.post("https://healthy-sideways-freeze.glitch.me/turn-on");
  } catch (error) {
    console.error("Erro ao ativar a VM:", error);
  }
};

onMounted(async () => {
  window.addEventListener("paste", handlePasteUpload);
  await turnOnVM();
});
</script>

<style scoped>
.home-container {
  margin: 20px auto;
  max-width: 1100px;
}

.main-container {
  flex-flow: nowrap !important;
  margin: 32px;
  padding: 16px;
}

.list-container {
  margin: 32px;
  padding: 24px;
  max-width: 1200px;
  width: 100%;
}

.interation-content {
  flex-flow: column;
  justify-content: flex-start;
  width: 90%;
  margin-right: 20px;
}

.title-text {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 24px;
}

.description-text {
  font-size: 16px;
  font-weight: 500;
}

.uploader-container {
  margin-top: 20px;
  width: 100%;
  border: 2px dashed #9688f2;
  border-radius: 4px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
}

.uploader-container:hover {
  border-color: #9688f2;
}

.uploaded-image {
  width: 70%;
  height: auto;
  background-color: transparent;
  margin: 0 auto;
}

.resulted-image {
  width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.n-upload-dragger {
  border: none;
}

.uploader-text {
  font-size: 16px;
  font-weight: bold;
}

.result-content {
  flex-direction: column;
  margin-top: 20px;
}

.customizations-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
  justify-content: center;
}

.customization-card {
  width: 300px;
  height: 300px;
  padding: 16px;
  text-align: center;
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.customization-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.customization-content {
  align-items: center;
}

.customization-checkbox {
  position: absolute;
  top: 10px;
  right: 10px;
}

.action-content {
  margin-bottom: 16px;
}

.image {
  height: 220px;
  object-fit: contain;
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

@media (max-width: 768px) {
  .main-container {
    flex-flow: column !important;
  }

  .interation-content {
    width: 100%;
  }

  .result-content {
    margin-top: 20px;
    padding: 0 20px;
    flex-direction: column-reverse;
  }

  .n-image {
    width: 70% !important;
    height: 70% !important;
  }
}
</style>