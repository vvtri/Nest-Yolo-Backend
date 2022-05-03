import { Injectable } from '@nestjs/common'
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule'

@Injectable()
export class AppService {
	constructor(private schedulerRegistry: SchedulerRegistry) {}
	// @Cron('*/2 * * * * *')
	// getHello(): string {
	// 	console.log(`Cron at: ${new Date(Date.now()).toLocaleString()}`)
	// 	return 'Hello'
	// }

	@Interval(5000)
	intervalSample() {
		console.log(`This is interval print every  5s`)
	}

	@Timeout(5000)
	timeoutSample() {
		console.log(
			`This is timeout print after server start 5s and stop notifications`
		)
		const job = this.schedulerRegistry.getCronJob('notifications')
		job.stop()
	}

	@Cron('* * * * * *', {
		name: 'notifications',
	})
	notification() {
		console.log('This is notification, this will be stop after timeout print')
	}
}
