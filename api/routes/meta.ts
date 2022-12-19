import express, { Request, Response } from 'express';
import { WithId } from 'mongodb';
import { metaApi } from '../config';
import { NodeTypeMeta } from '../model';

const metaRoute = express.Router();

metaRoute.get('/', (req: Request, res: Response) => {
    metaApi.findAll().then(rlt => {
        res.json(rlt);
    })
});

metaRoute.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (id) {
        metaApi.findMetaById(id).then(rlt => {
            res.json(rlt);
        })
    } else {
        res.status(404);
    }
});

metaRoute.post('/', (req: Request, res: Response) => {
    const meta = req.body as NodeTypeMeta;
    if (meta) {
        metaApi.addMeta(meta).then(rlt => {
            res.status(201).json(Object.assign({}, meta, {
                _id: rlt.insertedId
            }))
        })
    }
});

metaRoute.patch('/', (req: Request, res: Response) => {
    const meta = req.body as WithId<NodeTypeMeta>;
    const body = Object.assign({}, meta)
    if (body) {
        metaApi.updateMeta(body).then(rlt => {
            if (rlt.ok) {
                res.json(meta);
            } else {
                res.status(500);
            }
        })
    } else {
        res.status(404);
    }
});

metaRoute.delete('/', (req: Request, res: Response) => {
    const meta = req.body as WithId<NodeTypeMeta>;
    if (meta) {
        metaApi.deleteMeta(meta).then(rlt => {
            if (rlt.acknowledged) {
                return res.json(meta);
            }
        })
    } else {
        return res.status(500);
    }

});

export { metaRoute };