import React from 'react'
import { UAParser } from "ua-parser-js";

const logInfo = async () => {
  const parser = new UAParser();
  const result = parser.getResult();

  const response = await fetch("https://api.ipify.org?format=json");
  const ipData = await response.json();

  return {
    browser: result.browser.name,
    os: result.os.name,
    device: result.device.type || "desktop",
    ip: ipData.ip,
  };
}

export default logInfo
