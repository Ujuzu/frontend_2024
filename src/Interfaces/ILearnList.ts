
export interface ILearnListResponse {
    id: number;
    attributes: ILearnListAttributes;
}

export interface ILearnListAttributes {
    learn_list_name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
};
