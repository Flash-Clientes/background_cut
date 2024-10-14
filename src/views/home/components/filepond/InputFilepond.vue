<script setup>
import axios from 'axios'
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits([ 'change' ]);
const props = defineProps({
    label: String,
    acceptedFileTypes: Array,
    labelFileTypeNotAllowed: String,
    Cloudinary: Object
});

const vFilepond = {
    mounted: (el) => {
        // eslint-disable-next-line no-undef 
        FilePond.registerPlugin(
        // eslint-disable-next-line no-undef
        FilePondPluginImagePreview,
        // eslint-disable-next-line no-undef
        FilePondPluginFileMetadata,
        // eslint-disable-next-line no-undef
        FilePondPluginFileEncode,
        // eslint-disable-next-line no-undef
        FilePondPluginFileValidateType
        );
        // eslint-disable-next-line no-undef
        const pond = FilePond.create(
        el,
        {
            credits:false,
            labelIdle: props.label,
            allowFileMetadata: true,
            allowFileTypeValidation: true,
            acceptedFileTypes: props.acceptedFileTypes || [],
            labelFileTypeNotAllowed: props.labelFileTypeNotAllowed || "Tipo de arquivo inválido!",
            fileValidateTypeLabelExpectedTypes: "Esperamos um arquivo do tipo [{allTypes}]",
            chunkUploads: true,
            onaddfile: (error, file) => {
                if(pond.acceptedFileTypes.length != 0){
                    if (file.fileType && pond.acceptedFileTypes.indexOf(file.fileType) === -1) return;
                }
                changeValue(error, file);
            },
            onremovefile: removeValue
        }
        );
        
    }
};

const changeValue = async (err, fileItem) => {
    if(props.Cloudinary){
        
        const { cloudname, uploadpreset, api_key } = props.Cloudinary
        
        const formData = new FormData();
        formData.append('file', fileItem.file);
        formData.append('upload_preset', uploadpreset);
        formData.append('api_key', api_key);
        
        try{
            const { data: cloudURL } = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
            );
            
            emit('change', cloudURL)
            
        }catch(error){
            console.log(error);
        }
    }else emit('change', fileItem.getFileEncodeBase64String())
};

// eslint-disable-next-line no-unused-vars
const removeValue = (source, load, error) => {
    emit('change', null)
};

</script>

<template>
    <input type="file" class="filepond" name="filepond" v-filepond>
</template>

<style src="./main.css" scoped></style>
