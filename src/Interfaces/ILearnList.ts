import { IMeta } from "./IMeta";

export interface ILearnListResponse extends ILearnListAttributes{
    id: number;
    documentId: string;

}

export interface ILearnListAttributes {
    learn_list_name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
};

export interface ILearnListStrapiResponse {
    data: ILearnListResponse[];
    meta:IMeta;
}