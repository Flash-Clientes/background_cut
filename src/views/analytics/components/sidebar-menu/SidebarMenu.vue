<template>
    <n-layout-sider
    bordered
    show-trigger
    collapse-mode="width"
    :collapsed-width="52"
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
            'fill': 'currentColor',
            'width': '24px',
            'height': '24px',
        }, [
            h('path', { d: 'M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z' }),
        ]),
    },
    {
        label: t('menu.history'),
        key: '/history',
        icon: () => h('svg', { 
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'fill': 'currentColor',
            'width': '24px',
            'height': '24px',
        }, [
            h('path', { d: 'M12 21q-3.45 0-6.012-2.287T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z' }),
        ]),
    },
]);

const adminMenuOptions = computed(() => [
    {
        label: t('menu.users'),
        key: 'dashboard/admin/users',
        key: '#',
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
        key: '#',
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
    {
        label: t('menu.settings'),
        key: '#',
        icon: () => h('svg', { 
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'fill': 'none',
            'stroke': 'currentColor',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            'width': '24px',
            'height': '24px',
        }, [
            h('path', { d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c.996.608 2.296.07 2.572-1.065' }),
            h('path', { d: 'M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0' }),
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