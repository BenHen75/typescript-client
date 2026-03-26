#!/usr/bin/env node

import { generateSerial } from '../dist/bin/serial.js';

console.info(`🔐 Clé générée : ${generateSerial()}`);
