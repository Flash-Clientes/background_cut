<template>
  <n-space
    class="main-container"
    justify="space-between"
    align="center"
    size="large"
  >
    <n-space class="interation-content">
      <!-- Logo -->
      <n-avatar
        class="logo"
        size="120"
        src="https://flashvolve.com/images/logo_automacao_criativa.svg"
        alt="Logo Autmação Criativa"
      />

      <!-- Título -->
      <n-typography>
        <n-h1 class="title-text">Bem vindo à Flash Automação Criativa</n-h1>
      </n-typography>

      <!-- Descrição -->
      <n-typography>
        <n-text class="description-text">
          Remova o fundo de suas imagens de forma fácil e rápida. Basta fazer o
          upload da sua imagem abaixo.
        </n-text>
      </n-typography>

      <!-- Input de Drag and Drop para Upload -->
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.5"
                >
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
            <img
              :src="previewImageUrlRef"
              alt="Imagem sem fundo"
              style="width: 100%"
            />
          </n-card>
        </n-upload>
      </n-space>
    </n-space>

    <!-- Imagem de Exemplo -->
    <n-spin :show="isLoading">
      <n-space class="result-content">
        <n-image
          :src="
            resultImageUrlRef ||
            'https://res.cloudinary.com/prime-arte/image/upload/v1729012179/santander/yoovdchflputukmowums.png'
          "
          alt="Imagem sem fundo"
          width="400"
        />

        <n-button
          v-if="resultImageUrlRef"
          style="color: #000000"
          :loading="loading"
          @click="downloadImage"
        >
          Download
        </n-button>
      </n-space>
    </n-spin>
  </n-space>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

import useRegisterCustomization from './hooks/register-customization/useRegisterCustomization';
const { registerCustomization } = useRegisterCustomization();

const isLoading = ref(false);
const previewImageUrlRef = ref("");
const resultImageUrlRef = ref("");

const handleUploadChange = async ({ fileList }) => {
  if (!fileList.length) {
    previewImageUrlRef.value = "";

    return;
  } else if (!fileList[0]?.file) {
    previewImageUrlRef.value = "";

    toast("Erro ao carregar a imagem. Tente novamente.", {
      position: "top-right",
      autoClose: 5000,
      type: "error",
      toastStyle: {
        "--toastify-icon-color-error": "#c60d31",
        "--toastify-color-error": "#c60d31",
      },
      progressStyle: {
        "--toastify-progress-bar-color-error": "#c60d31",
      },
    });

    return;
  }

  isLoading.value = true;

  const fileSize = fileList[0].file.size / 1024 / 1024;
  if (fileSize > 12) {
    isLoading.value = false;
    previewImageUrlRef.value = "";

    toast("O tamanho da imagem não pode ser maior que 12MB.", {
      position: "top-right",
      autoClose: 5000,
      type: "error",
      toastStyle: {
        "--toastify-icon-color-error": "#c60d31",
        "--toastify-color-error": "#c60d31",
      },
      progressStyle: {
        "--toastify-progress-bar-color-error": "#c60d31",
      },
    });

    return;
  }

  previewImageUrlRef.value = await uploadImageToCloudinary(fileList[0].file);

  let data = JSON.stringify({
    imageUrl: previewImageUrlRef.value,
    nameFile: `${new Date().getTime()}.png`,
  });
  console.log(data);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://healthy-sideways-freeze.glitch.me/process-image",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));

    resultImageUrlRef.value = response.data.imageUrl;

    toast("Imagem sem fundo gerada com sucesso!", {
      position: "top-right",
      autoClose: 5000,
      type: "success",
      toastStyle: {
        "--toastify-icon-color-success": "#00a854",
        "--toastify-color-success": "#00a854",
      },
      progressStyle: {
        "--toastify-progress-bar-color-success": "#00a854",
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 8000); // Aguarda 5 segundos (5000 ms)
  }
  /*const formData = new FormData();
    formData.append('file_url', previewImageUrlRef.value);
    formData.append('max-resolution', 12000000);
    formData.append('quality', 'medium');
    formData.append('format', 'png');

    try {
        const response = await axios.post('https://backgroundcut.co/api/v1/cut/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${import.meta.env.VITE_BACKGROUND_CUT_API_KEY}`,
            }
        }, {
            timeout: 2000,
        });

        if (response && response.data) {
            resultImageUrlRef.value = response.data.output_image_url;

            toast('Imagem sem fundo gerada com sucesso!', {
                position: 'top-right',
                autoClose: 5000,
                type: 'success',
                toastStyle: {
                    "--toastify-icon-color-success": "#00a854",
                    "--toastify-color-success": "#00a854",
                },
                progressStyle: {
                    "--toastify-progress-bar-color-success": "#00a854",
                },
            });

            const customizationToRegister = {
                'imagem_personalizada': resultImageUrlRef.value,
                'imagem_usuario': previewImageUrlRef.value,
                'campanha': 'Remoção de Fundo',
                'whatsapp': '5511999999999',
                'empresa_id': '0'
            };

            await registerCustomization(customizationToRegister);
        }
    } catch (error) {
        console.error('Erro ao processar a imagem. Tente novamente.', error);
        toast('Erro ao processar a imagem. Tente novamente.', {
            position: 'top-right',
            autoClose: 5000,
            type: 'error',
            toastStyle: {
                "--toastify-icon-color-error": "#c60d31",
                "--toastify-color-error": "#c60d31",
            },
            progressStyle: {
                "--toastify-progress-bar-color-error": "#c60d31",
            },
        });
    } finally {
        isLoading.value = false;
    }*/
};
// Função que faz o download da imagem
function downloadImage() {
  const imageUrl = resultImageUrlRef.value;
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      // Cria um objeto URL para o blob
      const blobUrl = URL.createObjectURL(blob);

      // Cria um elemento <a> temporário
      const link = document.createElement("a");
      link.href = blobUrl;

      // Define o nome do arquivo para o download
      link.download = "image.png";

      // Simula o clique no link para iniciar o download
      document.body.appendChild(link);
      link.click();

      // Remove o link do documento
      document.body.removeChild(link);

      // Revoga o objeto URL para liberar memória
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => console.error("Erro ao baixar a imagem:", error));
}

const uploadImageToCloudinary = async (fileItem) => {
  const formData = new FormData();
  formData.append("file", fileItem);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

  const { data: cloudUrl } = await axios.post(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/auto/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return cloudUrl.secure_url;
};

// Função para fazer a requisição para ativar o glitch
async function turnOnVM() {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://healthy-sideways-freeze.glitch.me/turn-on",
    headers: {},
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error("Error making POST request:", error);
  }
}

// Quando o componente for montado, faz a requisição
onMounted(() => {
  turnOnVM();
});
</script>

<style scoped>
.main-container {
  flex-flow: nowrap !important;
  margin: 32px;
  padding: 16px;
  background-color: #ffffff;
}

.interation-content {
  flex-flow: column;
  justify-content: flex-start;
  width: 90%;
  margin-right: 20px;
}

.logo {
  margin-bottom: 20px;
  background-color: transparent;
}

.title-text {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.description-text {
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.uploader-container {
  margin-top: 20px;
  padding: 0;
  width: 100%;
  border: 2px dashed #9688f2;
  border-radius: 4px;
  background-color: #fafafa;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
}

.uploader-container:hover {
  border-color: #9688f2;
  background-color: #f0f2f5;
}

.uploaded-image {
  width: 70%;
  height: auto;
  background-color: transparent;
  margin: 0 auto;
}

.n-upload-dragger {
  border: none;
}

.uploader-text {
  font-size: 16px;
  font-weight: bold;
  color: #666;
}

.result-content {
  flex-direction: column;
  margin-top: 20px;
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
