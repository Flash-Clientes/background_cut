<template>
    <n-space class="main-container" justify="center" align="center" size="large">
         <n-typography>
             <n-h1 class="title-text">Todas as Personalizações</n-h1>
         </n-typography>
         
         <n-space class="customizations-container" align="start">
             <n-card
                 v-for="(customization, index) in fetchedCustomizations"
                 :key="index"
                 class="customization-card"
                 bordered
             >
                 <n-space class="customization-content" vertical size="small">
                     <n-image 
                         :src="customization.imagem_usuario" 
                         alt="Imagem do Usuário"
                         class="image"
                         width="200"
                     />
                     <n-text class="label">Imagem Processada:</n-text>
                     <n-image 
                         :src="customization.imagem_personalizada" 
                         alt="Imagem Processada"
                         class="image"
                         width="200"
                     />
                     <n-text class="label">Campanha: {{ customization.campanha }}</n-text>
                 </n-space>
             </n-card>
         </n-space>
     </n-space>
 </template>
 
 <script setup>
 import { onMounted } from 'vue'
 import useListCustomizations from './hooks/useListCustomizations'
 const { fetchedCustomizations, fetchCustomizations } = useListCustomizations()
 
 onMounted(async () => {
     console.log('mounted')
     await fetchCustomizations();
     console.log(fetchedCustomizations.value)
 });
 </script>
 
 <style scoped>
 .main-container {
     margin: 32px;
     padding: 24px;
     background-color: #fafafa;
     border-radius: 12px;
     box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
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
 }
 
 .label {
     font-weight: 600;
     color: #4b4b4b;
     margin-top: 8px;
 }
 </style>
 