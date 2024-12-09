<template>
    <n-config-provider :theme="theme" :theme-overrides="theme ? darkThemeOverrides : lightThemeOverrides">
        <n-layout has-sider v-if="!hideSidebar">
            <SidebarMenu 
            v-if="!isMobile"
            :initial-locale="locale"
            :user="currentUser"
            :theme="theme?.name"
            />
            
            <n-layout-content class="main">
                <HeaderMenu 
                :initial-locale="locale"
                :user="currentUser"
                :theme="theme?.name"
                @updateTheme="updateTheme"
                @updateLanguage="changeLanguage"
                />
                
                <router-view :locale="locale" />
            </n-layout-content>
        </n-layout>
    </n-config-provider>
</template>

<script setup>
import { computed, onMounted, provide, ref } from 'vue';

import { useRoute } from 'vue-router';
import { darkTheme } from 'naive-ui';

import SidebarMenu from './components/sidebar-menu/SidebarMenu.vue';
import HeaderMenu from './components/header-menu/HeaderMenu.vue';

const isMobile = computed(() => window.innerWidth < 768)

const lightThemeOverrides = {
    'common': {
        'primaryColor': '#9688f2',
        'primaryColorHover': '#9688f2',
        'primaryColorPressed': '#9688f2',
    },
    'Progress': {
        'primaryColor': '#9688f2',
    },
    'Switch': {
        'railColorActive': '#9688f2',
    },
    'Layout': {
        'color': '#f5f5f5',
    },
    'Button': {
        'textColorPrimary': '#000',
        'textColorDisabledPrimary': '#000',
    },
};

const darkThemeOverrides = {
    'common': {
        'primaryColor': '#9688f2',
        'primaryColorHover': '#9688f2',
        'primaryColorPressed': '#9688f2',
    },
    'Progress': {
        'primaryColor': '#9688f2',
    },
    'Switch': {
        'railColorActive': '#9688f2',
    },
    'Layout': {
        'color': '#222',
    },
    'Button': {
        'textColorPrimary': '#ffffff',
        'textColorDisabledPrimary': '#ffffff',
    },
};

const detectedLocale = navigator.language.split('-')[0];
const locale = ref(detectedLocale);

const theme = ref(null);

const route = useRoute();
const hideSidebar = computed(() => route.meta.hideSidebar);

const currentUser = {
    name: 'John Doe',
    email: 'john@flashvolve.com',
    status: 'admin',
};

onMounted(() => {
    locale.value = detectedLocale || 'pt';
});

provide('analytics', {
    locale,
});

const updateTheme = (selectedTheme) => {
    theme.value = selectedTheme === 'dark' ? darkTheme : null;
};

const changeLanguage = (lang) => {
    locale.value = lang;
};
</script>

<style scoped>
.n-layout-scroll-container {
    overflow-y: hidden;
}
.n-config-provider {
    height: 100vh;
    margin: 0;
    padding: 0;
}
.n-layout {
    height: 100%;
    margin: 0;
    padding: 0;
}
.main {
    padding: 0px;
}
</style>