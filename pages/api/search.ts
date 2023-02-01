import edgeChromium from 'chrome-aws-lambda'

import puppeteer from 'puppeteer-core'

const LOCAL_CHROME_EXECUTABLE = '/usr/bin/google-chrome'


export default async function handler(req, res) {
    const { search } = JSON.parse(req.body);
    console.log(search)
    // Edge executable will return an empty string locally.
    const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE
    
    const browser = await puppeteer.launch({
      executablePath,
      args: edgeChromium.args,
      headless: true,
    })
    
    const page = await browser.newPage()
    await page.goto(`https://www.fatsecret.co.id/kalori-gizi/search?q=${search}`)
    
    let data = await page.$eval(
      'table.generic:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(3)',
      (element) => element.textContent
    )

    // Then save the post data to a database
    await res.status(200).json({ message: data });

  }