import { Document } from "mongoose";

export default interface ITopic extends Document{
    name:string;
    author:string;
    extraInformation:string;
}