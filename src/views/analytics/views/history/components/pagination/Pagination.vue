<template>
    <n-space justify="space-between">
        <n-space>
            <n-label> {{ t('pages.history.per_page') }} </n-label>
            <n-select 
            v-model:value="props.pageSize" 
            :options="sizeOptions" 
            @update:value="pageChange(props.currentPage, $event)"
            style="width: 80px;"
            />

            <span> {{ t('pages.history.showing', { count: props.pageSize, total: props.totalPages }) }} </span>
        </n-space>

        <n-pagination 
        v-model:page="props.currentPage"
        :page-size="props.pageSize"
        :item-count="totalPages"
        @update:page="pageChange"
        />
    </n-space>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const sizeOptions = [
    { label: '4', value: 4 },
    { label: '8', value: 8 },
    { label: '12', value: 12 },
    { label: '16', value: 16 },
    { label: '20', value: 20 },
];

const emit = defineEmits(['pageChange']);
const props = defineProps({
    currentPage: Number,
    pageSize: Number,
    totalPages: Number 
});

const pageChange = (page, pageSize = props.pageSize) => emit('pageChange', page, pageSize);
</script>