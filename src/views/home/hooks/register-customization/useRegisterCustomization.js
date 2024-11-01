import { supabase } from '../../../../providers/supabase';

const useRegisterCustomization = () => {
    /* Função para tratar erros de requisição 
    * @param {string} action - Nome da ação que gerou o erro
    * @param {object} error - Objeto de erro retornado pela requisição
    * @returns {void}
    */
    const handleRequestError = (action, error) => {
        console.error(`useRegisterCustomization: ${action}`, error);
        throw error;
    };

    /* Função para registrar uma nova personalização no banco de dados
    * @param {object} customization - Objeto com as informações da personalização
    * @returns {void}
    */
    const registerCustomization = async (customization) => {
        try {
            const { error } = await supabase.from('personalizacoes').insert(customization).single();
            if (error) handleRequestError('registerCustomization', error);
        } catch (error) {
            handleRequestError('registerCustomization', error);
        }
    };

    return {
        registerCustomization,
    };
};

export default useRegisterCustomization;