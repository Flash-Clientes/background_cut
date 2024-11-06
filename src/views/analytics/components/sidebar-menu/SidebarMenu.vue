<template>
    <n-layout-sider
    bordered
    show-trigger
    collapsed-width="52"
    @collapse="isCollapsed = true"
    @expand="isCollapsed = false"
    >
        <div class="logo-container" :style="{ padding: isCollapsed ? '10px' : '20px' }">
            <img :src="currentLogo" alt="Logo" class="logo" />
        </div>

        <div v-if="props.user && props.user.status && props.user.status.toLowerCase() !== 'onboarding'">
            <n-menu
            :options="menuOptions"
            v-model:value="selectedKey"
            @update:value="navigate"
            style="width: 80%; padding: 4px;"
            />
        </div>

        <div v-if="props.user && props.user.status && props.user.status.toLowerCase() === 'admin'">
            <n-divider title-placement="left">
                Admin
            </n-divider>

            <n-menu 
            :options="adminMenuOptions"
            v-model:value="selectedKey"
            @update:value="navigate"
            />
        </div>
    </n-layout-sider>
</template>

<script setup>
import { computed, h, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const selectedKey = ref('/dashboard');

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    theme: {
        type: String,
        required: true,
    },
});

const isCollapsed = ref(false);
const logos = {
    large: {
        dark: 'https://res.cloudinary.com/flashvolve/image/upload/v1727462096/clientes/F/Flashvolve/fvcedk4wwagpvxwkd3p2.svg', 
        light: 'https://flashvolve.com/images/Logo-growth_baixa.svg',
    },
    small: {
        dark: 'https://storage.googleapis.com/flashvolve/live-tt/output_image.png', 
        light: 'https://storage.googleapis.com/flashvolve/live-tt/output_image.png',
    },
};

const currentLogo = computed(() => {
    const logoType = isCollapsed.value ? 'small' : 'large';
    return logos[logoType][props.theme || 'light'];
});

const menuOptions = computed(() => [
    {
        label: t('menu.dashboard'),
        key: '/dashboard',
        icon: () => h('svg', { 
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'fill': 'none',
            'stroke': 'currentColor',
            'stroke-width': '1',
            'width': '24px',
            'height': '24px',
        }, [
            h('path', { d: 'M13.5 9V4H20v5zM4 12V4h6.5v8zm9.5 8v-8H20v8zM4 20v-5h6.5v5zm1-9h4.5V5H5zm9.5 8H19v-6h-4.5zm0-11H19V5h-4.5zM5 19h4.5v-3H5zm4.5-3' }),
        ]),
    },
    {
        label: t('menu.uploader'),
        key: '/uploader',
        icon: () => h('svg', { 
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'fill': 'none',
            'stroke': 'currentColor',
            'stroke-width': '2',
            'width': '24px',
            'height': '24px',
        }, [
            h('path', { d: 'M4.5 17H4a1 1 0 0 1-1-1a3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1a3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3a1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z' }),
        ]),
    },
    {
        label: t('menu.history'),
        key: '/history',
        icon: () => h('svg', { 
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'fill': 'none',
            'stroke': 'currentColor',
            'stroke-width': '2',
            'width': '24px',
            'height': '24px',
        }, [
            h('path', { d: 'M4.5 17H4a1 1 0 0 1-1-1a3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1a3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3a1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z' }),
        ]),
    },
]);

const adminMenuOptions = computed(() => [
    {
        label: t('menu.users'),
        key: 'dashboard/admin/users',
        key: '/dashboard/admin/users',
        icon: () => h('svg', { 
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'fill': 'none',
            'stroke': 'currentColor',
            'stroke-width': '1.8',
            'width': '24px',
            'height': '24px',
        }, [
            h('path', { d: 'M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4' }),
        ]),
    },
    {
        label: t('menu.organizations'),
        key: '/dashboard/admin/organizations',
        icon: () => h('svg', { 
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'fill': 'currentColor',
            'width': '24px',
            'height': '24px',
        }, [
            h('path', { d: 'M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7z' }),
        ]),
    },
]);

const navigate = (key) => {
    selectedKey.value = key;
    router.push(key);   
};
</script>

<style scoped>
.logo-container {
    padding: 20px;
    text-align: center;
}

.logo {
    max-width: 100%;
    height: auto;
}

.n-button {
    display: flex;
    align-items: center;
}
</style>