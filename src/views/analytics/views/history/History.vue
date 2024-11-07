<template>
    <n-space class="list-container" justify="center" align="center" size="large" vertical>
      
      <n-space vertical>
        <n-typography>
          <n-h1 class="title-text">Personalizações Anteriores</n-h1>
        </n-typography>
        
        <n-space class="action-content" align="flex-start" justify="space-between">
          <n-space>
            <n-checkbox :checked="isAllSelected" @change="toggleSelectAll" />
            <n-text>Selecionar Todas</n-text>
          </n-space>
  
          <n-button 
            type="error" 
            @click="deleteSelectedCustomizations" 
            :disabled="!selectedCustomizations.length"
            >
            <i class="fa fa-trash"></i>
          </n-button>
  
          <n-button 
          type="primary"
          @click="downloadSelectedCustomizations"
          :disabled="!selectedCustomizations.length"
          >
            <i class="fa fa-download"></i>
          </n-button>
        </n-space>
        
        <n-empty v-if="!fetchedCustomizations?.length" description="Nenhuma personalização encontrada." />
        
      </n-space>
    
      <n-space class="customizations-container" align="start" v-if="fetchedCustomizations">
        <n-card
          v-for="(customization, index) in fetchedCustomizations"
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
              :src="customization.imagem_personalizada" 
              alt="Imagem do Usuário"
              class="image"
              width="200"
              @click="openCustomizationModal(customization)"
            />
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

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import useListCustomizations from './hooks/useListCustomizations'
const { fetchedCustomizations, fetchCustomizations } = useListCustomizations()

import useRemoveCustomization from './hooks/useRemoveCustomization'
const { removeCustomization } = useRemoveCustomization()

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

const downloadSelectedCustomizations = async () => {
  if (!selectedCustomizations.value.length) {
    showToast("Nenhuma customização selecionada para download.", "error");
    return;
  }

  try {
    const zip = new JSZip();
    
    if (selectedCustomizations.value.length > 1) {
      await Promise.all(
        selectedCustomizations.value.map(async (customizationId, index) => {
          const customization = fetchedCustomizations.value.find(c => c.id === customizationId);
          if (customization && customization.imagem_personalizada) {
            const response = await fetch(customization.imagem_personalizada);
            const blob = await response.blob();
            zip.file(`${customization.campanha}_${index + 1}.png`, blob);
          }
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "customizacoes.zip");
    } else {
      const customizationId = selectedCustomizations.value[0];
      const customization = fetchedCustomizations.value.find(c => c.id === customizationId);
      if (customization && customization.imagem_personalizada) {
        const response = await fetch(customization.imagem_personalizada);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${customization.campanha}.png`;
        link.click();
        URL.revokeObjectURL(blobUrl);
      }
    }

    showToast("Imagens das customizações selecionadas baixadas com sucesso!");
  } catch (error) {
    console.error("Erro ao baixar as customizações:", error);
    showToast("Erro ao baixar as customizações. Tente novamente.", "error");
  }
};

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
.list-container {
  margin: 32px;
  padding: 24px;
  max-width: 1200px;
  width: 100%;
}

.customizations-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
  justify-content: center;
}

.customization-card {
  width: 280px;
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

}
</style>