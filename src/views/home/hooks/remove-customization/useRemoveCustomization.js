import { supabase } from '../../../../providers/supabase';

const useRemoveCustomization = () => {
    const handleRequestError = (action, error) => {
        console.error(`useRemoveCustomization: ${action}`, error);
        throw error;
    }

    const removeCustomization = async (customizationId) => {
        try {
            const { error } = await supabase.from('personalizacoes').delete().eq('id', customizationId);
            if (error) handleRequestError('removeCustomization', error);
        } catch (error) {
            handleRequestError('removeCustomization', error);
        }
    }

    return {
        removeCustomization,
    };
};

export default useRemoveCustomization;