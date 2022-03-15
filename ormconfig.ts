import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

// When run migration, dotenv do not load, so must load again
import * as dotenv from 'dotenv'
dotenv.config({
	path: '.env.development',
})

const config: PostgresConnectionOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: parseInt(process.env.PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: ['**/*.entity.js'],
	synchronize: false,
	migrationsRun: false,
	migrations: ['dist/src/migrations/*.js'],
	cli: {
		migrationsDir: 'src/migrations',
	},
}

export default config
