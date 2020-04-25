import { CBFavourite } from './CBFavourite';
import { ResponseHelper } from '../helpers/ResponseHelper';
import { Includeable } from 'sequelize/types';
import express from 'express';

const responseHelper = new ResponseHelper() 
export class CBFavouriteController {

    includeableAssociations!: Includeable[]

    constructor(associations: Includeable[]) {
        this.includeableAssociations = associations;
    }

    public async getUserFavourites(req: express.Request, res: express.Response) {
        try {
            var favs = CBFavourite.findAll({
                where: {user_id: req.params.id},
                include: this.includeableAssociations
            })
            return responseHelper.success(res, {"favourties": favs});

        }catch(error){
            console.error("error while fetching user favourites: ", error)
        }
    }

    public async addUserFavourite(req: express.Request, res: express.Response) {
        try {
            const fav = await CBFavourite.create(req.body)
            return responseHelper.success(res, {"favourite": fav})

        } catch(error){
            console.error("error while add user favourite: ", error)
        }
    }
}