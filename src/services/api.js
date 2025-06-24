import axios from "axios";

const API_BASE_URL = 'https://apipw.leoproti.com.br/produtos';

export const getProducts = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch(error){
        console.error('Error ao Buscar Produtos', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await axios.post(API_BASE_URL, productData);
        return response.data;
    } catch (error){
      console.error('Error ao criar produto', error);
      throw error;
    }
};

export const updateProduct = async (id, productData) => { 
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, productData);
        return response.data;
    } catch(error) {
        console.error(`Error ao atualizar produto com ID ${id}:`, error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete (`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`error ao deletar produto com ID ${id}:`, error);
        throw error;
    }
};