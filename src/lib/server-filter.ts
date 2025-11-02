import apiClient from "./apiServer"

export interface BaseFilter {
    id: number;
    name: string;
}

export const getAllWorkSchedules = async () => {
    const { data } = await apiClient.get<BaseFilter[]>('/v1/work-schedules');
    return data;
}

export const getAllWorkModels = async () => {
    const { data } = await apiClient.get<BaseFilter[]>('/v1/work-models');
    return data;
}

export const getAllCategories = async () => {
    const { data } = await apiClient.get<BaseFilter[]>('/v1/categories');
    return data;
}

export const getAllContractTypes = async () => {
    const { data } = await apiClient.get<BaseFilter[]>('/v1/contract-types');
    return data;
}

export const getAllExperienceLevels = async () => {
    const { data } = await apiClient.get<BaseFilter[]>('/v1/experience-levels');
    return data;
}

export const getAllDisabilityTypes = async () => {
    const { data } = await apiClient.get<BaseFilter[]>('/v1/disability-types');
    return data;
}
