import '@svgdotjs/svg.js'
import '@svgdotjs/svg.filter.js'
import { Workspace } from './Workspace';
import { BasicBlocks } from './blocks/BasicBlocks';

const el = document.getElementById('app')

const ws = new Workspace(el)

ws.addBlock(new BasicBlocks(ws))