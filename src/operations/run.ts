import execa from 'execa'
import chalk from 'chalk'
import { CI, KNIGHTLY_DEBUG } from '../config'

export async function run(command: string, dir: string, env: Record<string, string> = {}, stdio?: 'inherit') {
  console.log(chalk.blue(`> cd ${dir}`))
  console.log(chalk.blueBright(`$ ${command}`))
  try {
    await execa.command(command, {
      cwd: dir,
      stdio: KNIGHTLY_DEBUG ? 'inherit' : stdio,
      env: CI
        ? {
          ...process.env,
          NODE_AUTH_TOKEN: '',
          NPM_TOKEN: '',
          GITHUB_TOKEN: '',
          ...env,
        }
        : {
          ...process.env,
          ...env,
        },
    })
  }
  catch (error) {
    console.error(error.stderr?.toString() || error)
    if (error.status !== 0) {
      throw new Error(`[${error.status}] ${error.message}`)
    }
  }
}
