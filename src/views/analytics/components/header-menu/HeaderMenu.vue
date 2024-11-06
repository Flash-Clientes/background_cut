<template>
    <n-layout-header>
        <div class="header-menu">
            <div class="logo-container">
                <img :src="currentLogo" alt="Logo" class="logo">
            </div>

            <div class="language-switcher">
                <n-dropdown
                :options="languageOptions"
                trigger="click"
                @select="changeLanguage"
                >
                    <n-button>
                        <img :src="currentFlagUrl" alt="Language" class="flag-icon">
                    </n-button>
                </n-dropdown>
            </div>

            <div class="theme-switcher" :key="theme">
                <n-dropdown :options="themeOptions" trigger="click" @select="changeTheme">
                    <n-button>
                        <i :class="currentThemeIcon" style="margin-right: 8px;"></i> {{ currentThemeLabel }}
                    </n-button>
                </n-dropdown>
            </div>

            <n-button circle size="large" class="hamburguer-button" @click="showMobileMenuDrawer = true">
                <i class="fa fa-bars"></i>
            </n-button>

            <div class="profile-conetnt" v-if="props.user">
                <n-space align="center">
                    <n-avatar size="large" @click="router.push({ name: 'Settings' })">
                        {{ props.user.email.charAt(0).toUpperCase() }}
                    </n-avatar>

                    <n-space vertical>
                        <n-text strong>
                            {{ t('menu.welcome', { name: props.user.name }) }}
                        </n-text>
                        <n-text type="secondary">{{ props.user.email }}</n-text>
                    </n-space>

                    <n-space>
                        <n-button circle size="small" @click="handleLogout">
                            <i class="fa fa-sign-out"></i>
                        </n-button>
                    </n-space>
                </n-space>
            </div>
        </div>

        <!-- 
            MobileMenu Here 
            ...    
        -->
    </n-layout-header>
</template>

<script setup>
import { h, computed, ref } from 'vue';
import { darkTheme } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const router = useRouter();
const emit = defineEmits(['updateTheme', 'updateLanguage']);

const props = defineProps({
    initialLocale: {
        type: String,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    theme: {
        type: String,
        required: true,
    }
});

const showMobileDrawer = ref(false);
const logos = {
    dark: 'https://res-console.cloudinary.com/flashvolve/thumbnails/v1/image/upload/v1730893371/Y2xpZW50ZXMvTC9MSVZFL2ZhYWRiZmFhLTgzOWQtNGY1YS1hOGFiLTgxZDhiMzFhMjBkYw==/drilldown', 
    light: 'https://res-console.cloudinary.com/flashvolve/thumbnails/v1/image/upload/v1730893371/Y2xpZW50ZXMvTC9MSVZFL2ZhYWRiZmFhLTgzOWQtNGY1YS1hOGFiLTgxZDhiMzFhMjBkYw==/drilldown',
};

const currentLogo = computed(() => {
    return logos[props.theme || 'light'];
});

locale.value = props.initialLocale;

const languages = {
    en: {
        label: 'English',
        flagUrl: 'https://goodies.icons8.com/web/common/header/flags/us.svg',
    },
    pt: {
        label: 'Português',
        flagUrl: 'https://goodies.icons8.com/web/common/header/flags/br.svg',
    },
};

const languageOptions = Object.keys(languages).map((key) => ({
    label: languages[key].label,
    key,
}));

const changeLanguage = (lang) => {
    if (languages[lang]) {
        locale.value = lang;
        emit('updateLanguage', lang); // Emite o evento para o App.vue
        handleCloseMobileMenu();
    } else {
        console.error(`Idioma desconhecido: ${lang}`);
    }
};

const currentFlagUrl = computed(() => {
    return languages[locale.value]?.flagUrl || '';
});

const currentLanguageLabel = computed(() => {
    return languages[locale.value]?.label || '';
});

const theme = ref(null);

const changeTheme = (themeKey) => {
    if (themeKey === 'dark' || themeKey === 'light') {
        theme.value = themeKey === 'dark' ? darkTheme : null;
        emit('updateTheme', themeKey);
        handleCloseMobileMenu();
    } else {
        console.error(`Tema desconhecido: ${themeKey}`);
    }
};

const currentThemeIcon = computed(() => theme.value?.name ? 'fa fa-moon' : 'fa fa-sun');
const currentThemeLabel = computed(() => theme.value?.name ? t('menu.dark_theme') : t('menu.light_theme'));

const themeOptions = [
    {
        label: t('menu.light_theme'),
        key: 'light',
        icon: () => h('i', { class: 'fa fa-sun' }),
    },
    {
        label: t('menu.dark_theme'),
        key: 'dark',
        icon: () => h('i', { class: 'fa fa-moon' }),
    },
];

const handleCloseMobileMenu = () => showMobileDrawer.value = false;

const handleLogout = () => {
    console.log('Logout');
};


</script>

<style scoped>
.header-menu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    padding: 8px;
    height: 61px;
}

.logo-container {
    display: none;
}

.language-switcher, .theme-switcher {
    margin: 16px;
}

.profile-content {
    display: flex;
    align-items: center;
    margin: 8px;
}

.flag-icon {
    width: 20px;
    height: 20px;
}

.hamburguer-button {
    display: none;
    position: fixed;
    top: 12px;
    right: 12px;
}

.n-avatar {
    cursor: pointer;
}

@media (max-width: 768px) {
    .header-menu {
        justify-content: space-between;
    }

    .hamburguer-button {
        display: flex;
    }

    .language-switcher,
    .theme-switcher,
    .profile-content {
        display: none;
    }

    .logo-container {
        display: block;
        width: 60%;
        height: 60%;
        margin-bottom: 12px;
    }
}
</style>