<template>
    <n-space class="main-container" justify="space-between" align="center" size="large">
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
                    Remova o fundo de suas imagens de forma fácil e rápida. Basta fazer o upload da sua imagem abaixo.
                </n-text>
            </n-typography>
            
            <!-- Input de Drag and Drop para Upload -->          
            <n-space class="uploader-container">
                <n-upload
                    :multiple="false"
                    :show-upload-list="false"
                    :accept="['image/*']"
                    @change="handleUploadChange"
                >
                    <n-upload-dragger v-if="!previewImageUrlRef">
                        <div>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="30px" 
                                height="30px" 
                                viewBox="0 0 24 24"
                            >
                                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                                    <path stroke-linejoin="round" d="M4.382 8.813v8.5c0 .845.344 1.656.957 2.253a3.3 3.3 0 0 0 2.308.934h8.706c.866 0 1.696-.336 2.308-.934a3.15 3.15 0 0 0 .957-2.253v-8.5m0-5.313H4.382c-.901 0-1.632.714-1.632 1.594v2.125c0 .88.73 1.593 1.632 1.593h15.236c.901 0 1.632-.713 1.632-1.593V5.094c0-.88-.73-1.594-1.632-1.594" />
                                    <path stroke-miterlimit="10" d="M12 12v5"/>
                                    <path stroke-linejoin="round" d="m14.293 14.105l-1.967-1.967a.46.46 0 0 0-.652 0l-1.967 1.967"/>
                                </g>
                            </svg>
                        </div>

                        <n-text style="font-size: 16px">
                            Clique ou arraste e solte a imagem aqui para fazer o upload.
                        </n-text>
                    </n-upload-dragger>
                    <n-card
                        v-else
                        class="uploaded-image"
                    >
                        <img :src="previewImageUrlRef" alt="Imagem sem fundo" style="width: 100%">
                    </n-card>
                </n-upload>
                
            </n-space>
        </n-space>

        <!-- Imagem de Exemplo -->
        <n-spin :show="isLoading">
            <n-space class="result-content">
                <n-image
                    :src="resultImageUrlRef || 'https://picsum.photos/600/600'"
                    alt="Imagem sem fundo"
                    width="400"
                />
    
                <n-text class="uploader-text">
                    {{ resultImageUrlRef ? 'Imagem sem fundo gerada com sucesso!' : 'Imagem de exemplo para testar a aplicação.' }}
                </n-text>
            </n-space>
        </n-spin>
    </n-space>
</template> 

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { toast } from "vue3-toastify";

const isLoading = ref(false);
const previewImageUrlRef = ref('');
const resultImageUrlRef = ref('');

const handleUploadChange = async ({ fileList }) => {
    if (!fileList.length) {
        previewImageUrlRef.value = '';

        return;
    } else if (!fileList[0]?.file) {
        previewImageUrlRef.value = '';

        toast('Erro ao carregar a imagem. Tente novamente.', {
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
        
        return;
    }

    isLoading.value = true;
    previewImageUrlRef.value = await uploadImageToCloudinary(fileList[0].file);;

    try {
        const { public_url } = await axios.post('https://southamerica-east1-zinc-iterator-358122.cloudfunctions.net/remove-bg', {
            image_url: previewImageUrlRef.value,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (public_url) resultImageUrlRef.value = public_url;
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
    }
};

const uploadImageToCloudinary = async (fileItem) => {
    const formData = new FormData();
    formData.append('file', fileItem);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

    const { data: cloudUrl } = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, 
        formData, 
        {
            headers: { 'Content-Type': 'multipart/form-data' },
        }
    );

    return cloudUrl.secure_url;
}
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
        flex-direction: column-reverse
    }

    .n-image {
        width: 70% !important;
        height: 70% !important;
    }

    .uploader-text {
        position: absolute;
        bottom: 30px;
        left: 25px;
    }
}
</style>