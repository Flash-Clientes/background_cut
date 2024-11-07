<template>
    <n-space class="main-container" justify="center" align="center" size="large" vertical>
        <n-input
            v-model:value="searchQuery"
            placeholder="Buscar personalizações..."
            clearable
            class="search-input"
            @keyup.enter="handleSearchCustomizations"
        />
        
        <n-space vertical>
            <n-typography>
                <n-h1 class="title-text">Gestão de Personalizações</n-h1>    
            </n-typography>
            
            <n-space v-if="filteredCustomizations?.length" class="select-all" align="flex-start" justify="flex-start">
                <n-checkbox :checked="isAllSelected" @change="toggleSelectAll" />
                <n-text>Selecionar Todas</n-text>
            </n-space>
            
            <n-empty v-if="!filteredCustomizations?.length" description="Nenhuma personalização encontrada." />
        </n-space>
        
        <n-button type="error" class="delete-button" @click="deleteSelectedCustomizations" :disabled="!selectedCustomizations.length">
            <i class="fa fa-trash"></i>
        </n-button> 

        <n-space class="customizations-container" align="start" v-if="filteredCustomizations">
            <n-card
                v-for="(customization, index) in filteredCustomizations"
                :key="index"
                class="customization-card"
                bordered
            >
                <n-checkbox 
                    :checked="selectedCustomizations.includes(customization.id)"
                    @click="toggleCustomizationSelection(customization.id)"
                    class="customization-checkbox"
                />

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
import { computed, onMounted, ref } from 'vue'
import { toast } from "vue3-toastify";

import useListCustomizations from './hooks/useListCustomizations'
const { fetchedCustomizations, fetchCustomizations } = useListCustomizations()

import useRemoveCustomization from './hooks/useRemoveCustomization'
const { removeCustomization } = useRemoveCustomization()

const searchQuery = ref('');

const showCustomizationModal = ref(false);
const customizationModalData = ref(null);

const isAllSelected = computed({
    get: () => {
        return fetchedCustomizations.value.length > 0 && selectedCustomizations.value.length === fetchedCustomizations.value.length;
    },
    set: (value) => {
        selectedCustomizations.value = value ? fetchedCustomizations.value.map(customization => customization.id) : [];
    }
});
const selectedCustomizations = ref([]);

const toggleSelectAll = () => {
    selectedCustomizations.value = isAllSelected.value ? [] : fetchedCustomizations.value.map(customization => customization.id);
}

const deleteSelectedCustomizations = () => {
    if (selectedCustomizations.value.length) {
        selectedCustomizations.value.forEach(async (customizationId) => {
            await removeCustomization(customizationId);
        });

        fetchedCustomizations.value = fetchedCustomizations.value.filter(customization => !selectedCustomizations.value.includes(customization.id));
        selectedCustomizations.value = [];    

        toast.success('Personalizações removidas com sucesso!', {
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
    }
}

const filteredCustomizations = computed(() => fetchedCustomizations.value?.filter(customization => {
    return customization.campanha.toLowerCase().includes(searchQuery.value.toLowerCase());
}));

const handleSearchCustomizations = () => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return;

    const foundCustomizations = fetchedCustomizations.value.filter(customization => {
        return customization.campanha.toLowerCase().includes(query) || customization.whatsapp.includes(query) || customization.empresa.toLowerCase().includes(query);
    });

    filteredCustomizations.value = foundCustomizations;
}

const toggleCustomizationSelection = (id) => {
    selectedCustomizations.value = selectedCustomizations.value.includes(id)
        ? selectedCustomizations.value.filter(customizationId => customizationId !== id)
        : [...selectedCustomizations.value, id];
}

const openCustomizationModal = (customization) => {
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

.search-input {
    width: 100%;
    max-width: 400px;
    margin-bottom: 24px;
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

.customization-checkbox {
    position: absolute;
    top: 10px;
    right: 10px;
}

.delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
}

.select-all {
    margin-bottom: 16px;
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
