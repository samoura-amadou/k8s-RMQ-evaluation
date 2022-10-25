import dotenv from 'dotenv'
dotenv.config()
import MilleFeuille from '@frenchpastries/millefeuille'
import handler from './handler'

MilleFeuille.create(handler, { port: process.env.PORT })
