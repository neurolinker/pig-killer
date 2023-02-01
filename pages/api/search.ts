import edgeChromium from 'chrome-aws-lambda'

import puppeteer from 'puppeteer-core'

const LOCAL_CHROME_EXECUTABLE = '/usr/bin/google-chrome'


export default async function handler(req, res) {
    const { search } = JSON.parse(req.body);
    const cssSelector = 'table.generic:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(3)'

    const minimal_args = [
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ];

    const blocked_domains = [
      'googlesyndication.com',
      'adservice.google.com',
    ];
    // Edge executable will return an empty string locally.
    const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE
    
    const browser = await puppeteer.launch({
      executablePath,
      args: minimal_args,
      headless: true,
      userDataDir: './puppeteer/storage'
    })
    
    const page = await browser.newPage()
    
//    What we may want to disable however, is unnecessary 3rd party scripts.
//    AKA ads / tracking etc. All of these add to page load time and are most likely 
//    undesirable for screenshot scripts (unless you actually want to screenshot the ads).
//    By using a list of blocked domains you can tell Puppeteer to not waste time 
//    downloading resources from those domains. You can find a list of known tracking 
//    domains here - unfortunately it may not be practical to include the whole list, 
//    since it is 9.8mb!
    await page.setRequestInterception(true);
    await page.on('request', request => {
      const url = request.url()
      if (blocked_domains.some(domain => url.includes(domain))) {
        request.abort();
      } else {
        request.continue();
      }
    });
    await page.goto(`https://www.fatsecret.co.id/kalori-gizi/search?q=${search}`)
    const content = await getContent(page, cssSelector);
    let data = '';
    if(content!== ''){
      data = content
    }
    await browser.close()
    // Then save the post data to a database
    await res.status(200).json({ message: data });

  }

  const getContent = async (page, cssSelector) => {
    let visible = true;
    const element = await page.waitForSelector(cssSelector, { visible: true, timeout: 2000 })
    .catch(() => {
      visible = false;
    });

    if(visible){
      const value = await element.evaluate(el => el.textContent);
      return value
    }

    return '';
  };