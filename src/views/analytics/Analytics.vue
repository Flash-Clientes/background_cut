<template>
    <n-config-provider :theme="theme" :theme-overrides="theme ? darkThemeOverrides : lightThemeOverrides">
        <n-layout-content class="main">
            <router-view :locale="locale" />
        </n-layout-content>
    </n-config-provider>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';

import { useRoute } from 'vue-router';
import { darkTheme } from 'naove-ui';

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
.n-layout-sider .n-layout-toggle-button {
  top: 5% !important;
}

.n-layout-sider-scroll-container {
  overflow: hidden !important;
}

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