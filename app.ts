import { App, LogLevel, AllMiddlewareArgs, SlackEventMiddlewareArgs, SlackCommandMiddlewareArgs, FileInstallationStore } from '@slack/bolt';
import * as dotenv from 'dotenv';

dotenv.config();

/** Initialization */
const app = new App({
	socketMode: true,
	appToken: process.env.SLACK_APP_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	clientId: process.env.SLACK_CLIENT_ID,
	clientSecret: process.env.SLACK_CLIENT_SECRET,
	scopes: ['commands'],
	installationStore: new FileInstallationStore(),
	stateSecret: 'my-state-secret',
	logLevel: LogLevel.INFO,
	installerOptions: {
		// If true, /slack/install redirects installers to the Slack Authorize URL
		// without rendering the web page with "Add to Slack" button
		directInstall: true,
	},
});

app.command('/revoke', async ({ client, ack }: AllMiddlewareArgs & SlackCommandMiddlewareArgs) => {
	try {
		await ack();
		const response = await client.auth.revoke();
		console.log(`revoke response: ${JSON.stringify(response)}`);
	} catch (error) {
		console.error(error);
	}
});

/** Register Listeners */
app.event('tokens_revoked', async ({ event }: AllMiddlewareArgs & SlackEventMiddlewareArgs<'tokens_revoked'>) => {
	try {
		console.log(`tokens_revoked event: ${JSON.stringify(event)}`);
	} catch (error) {
		console.error(error);
	}
});

/** Register Listeners */
app.event('app_uninstalled', async ({ event }: AllMiddlewareArgs & SlackEventMiddlewareArgs<'app_uninstalled'>) => {
	try {
		console.log(`app_uninstalled event: ${JSON.stringify(event)}`);
	} catch (error) {
		console.error(error);
	}
});


/** Start Bolt App */
(async () => {
	try {
		await app.start(3000);
		console.log('⚡️ Bolt app is running! ⚡️');
	} catch (error) {
		console.error('Unable to start App', error);
	}
})();
