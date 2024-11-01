<template>
    <n-space class="main-container" justify="center" align="center" size="large">
        <n-typography>
            <n-h1 class="title-text">Gestão de Personalizações</n-h1>
        </n-typography>
        
        <n-space class="customizations-container" align="start">
            <n-card
            v-for="(customization, index) in fetchedCustomizations"
            :key="index"
            class="customization-card"
            bordered
            >
                <n-space class="customization-content" vertical size="small">
                    <img
                    :src="customization.imagem_usuario" 
                    alt="Imagem do Usuário"
                    class="image"
                    width="200"
                    @click="openCustomizationModal(customization)"
                    />
                    <n-text class="label">Campanha: {{ customization.campanha }}</n-text>
                    <n-text class="label">Telefone: {{ customization.whatsapp }}</n-text>
                    <n-text class="label">Empresa: {{ 'Americanas' }}</n-text>
                </n-space>
            </n-card>
        </n-space>
    </n-space>

    <n-modal 
    v-model:show="showCustomizationModal" 
    title="Detalhes da Personalização"
    preset="dialog"
    style="width: 50%; text-align: center;"
    :negative-text="'Fechar'"
    @negative-click="() => showCustomizationModal = false"
    @close="showCustomizationModal = false"
    >
        <n-space vertical>
            <img
            :src="customizationModalData?.imagem_usuario"
            alt="Imagem do Usuário"
            width="200"
            style="margin-top: 16px;"
            />
        </n-space>
    </n-modal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useListCustomizations from './hooks/useListCustomizations'
const { fetchedCustomizations, fetchCustomizations } = useListCustomizations()

const showCustomizationModal = ref(false);
const customizationModalData = ref(null);

const openCustomizationModal = (customization) => {
    console.log(customization)
    customizationModalData.value = customization;
    showCustomizationModal.value = true;
}

onMounted(async () => {
    await fetchCustomizations();
});
</script>

<style scoped>
.main-container {
    margin: 32px;
    padding: 24px;
    max-width: 1200px;
    width: 100%;
}

.title-text {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 24px;
}

.customizations-container {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    width: 100%;
    justify-content: center;
}

.customization-card {
    width: 260px;
    padding: 16px;
    text-align: center;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #ffffff;
}

.customization-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.customization-content {
    align-items: center;
}

.image {
    margin: 10px 0;
    border-radius: 10px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    cursor: pointer;
}

.label {
    font-weight: 600;
    color: #4b4b4b;
    margin-top: 8px;
}
</style>
