import { ref } from 'vue';
import { supabase } from '../../../../providers/supabase';

const useListCustomizations = () => {
    const fetchedCustomizations = ref([]);

    /* Função para tratar erros de requisição 
    * @param {string} action - Nome da ação que gerou o erro
    * @param {object} error - Objeto de erro retornado pela requisição
    * @returns {void}
    */
    const handleRequestError = (action, error) => {
        console.error(`useListCustomizations: ${action}`, error);
        throw error;
    };

    /* Função para buscar todas as personalizações no banco de dados
    * @returns {array} - Array com as personalizações encontradas
    */
    const fetchCustomizations = async () => {
        try {
            const { data, error } = await supabase.from('personalizacoes').select('*');
            if (error) handleRequestError('fetchCustomizations', error);
            fetchedCustomizations.value = data;
        } catch (error) {
            handleRequestError('fetchCustomizations', error);
        }
    };

    return {
        fetchedCustomizations,
        fetchCustomizations,
    };
}

export default useListCustomizations;