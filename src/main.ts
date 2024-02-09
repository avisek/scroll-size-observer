import { ScrollSizeObserver } from './ScrollSizeObserver'
import './main.css'

const scroller = document.querySelector('.Scroller')!

const props = [
  'previousScrollWidth',
  'scrollWidth',
  'previousScrollHeight',
  'scrollHeight',
] as const

const statuses = props.map((prop) => document.getElementById(prop)!)

const scrollSizeObserver = new ScrollSizeObserver((entries) => {
  const entry = entries.find((entry) => entry.target === scroller)!
  
  statuses.forEach((elem) => {
    elem.textContent = String(entry[elem.id as (typeof props)[number]])
  })
})

scrollSizeObserver.observe(scroller)
