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
                <InputFilePond 
                    label="Clique ou arraste a imagem aqui"
                    :Cloudinary="{ cloudname: 'prime-arte', uploadpreset: 'santander', api_key: '429282383232114' }"
                    @change="handleUploadChange"
                ></InputFilePond>
            </n-space>
        </n-space>

        <!-- Imagem de Exemplo -->
        <n-spin :show="isLoading">
            <n-space class="result-content">
                <n-image
                    :src="resultImage || 'https://picsum.photos/600/600'"
                    alt="Imagem sem fundo"
                    width="400"
                />
    
                <n-text class="uploader-text">
                    {{ resultImage ? 'Imagem sem fundo gerada com sucesso!' : 'Imagem de exemplo para testar o BackgroundCut.' }}
                </n-text>
            </n-space>
        </n-spin>
    </n-space>

    <n-divider />
</template> 

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { toast } from "vue3-toastify";

import InputFilePond from './components/filepond/InputFilepond.vue';

const isLoading = ref(false);
const resultImage = ref(null);

const handleUploadChange = async (file) => {

    const { secure_url } = file;
    if (!secure_url) {
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
    }
    

    const formData = new FormData();
    formData.append('file_url', secure_url);
    formData.append('max-resolution', 12000000);
    formData.append('quality', 'medium');
    formData.append('format', 'png');

    try {
        isLoading.value = true;
        
        const response = await axios.post('https://backgroundcut.co/api/v1/cut/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${import.meta.env.VITE_BACKGROUND_CUT_API_KEY}`
            }
        });

        if (response && response.data) {
            resultImage.value = response.data.output_image_url;

            toast('Imagem processada com sucesso!', {
                position: 'top-right',
                autoClose: 5000,
                type: 'success',
                toastStyle: {
                    "--toastify-icon-color-success": "#0f5132",
                    "--toastify-color-success": "#0f5132",
                },
                progressStyle: {
                    "--toastify-progress-bar-color-success": "#0f5132",
                },
            });
        }
    } catch (error) {
        toast('Erro ao remover o fundo da imagem. Tente novamente.', {
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
</script>

<style scoped>
.main-container {
    flex-flow: nowrap !important;
    margin: 32px;
    padding: 16px;
    background-color: #f0f2f5;
}

.interation-content {
    flex-flow: column;
    width: 50%;
    margin-right: 20px;
}

.result-content {
    flex-direction: column;
    margin-top: 20px;
}

.logo {
    margin-bottom: 20px;
    background-color: transparent;
}

.title-text {
    font-size: 24px;
    font-weight: 700;
    color: #333;
}

.description-text {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.uploader-container {
    margin-top: 20px;
    padding: 0 80px;
    width: 100%;
    height: 200px;
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
    background-color: #f5f5f5;
}

.uploader-text {
    font-size: 16px;
    font-weight: bold;
    color: #333;
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
