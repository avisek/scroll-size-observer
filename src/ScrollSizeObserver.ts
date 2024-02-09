/**
 * Represents an entry passed to the `ScrollSizeObserver()` constructor's callback function,
 * providing access to the new and previous scroll sizes of the observed `Element`.
 */
export class ScrollSizeObserverEntry {
  constructor(
    /**
     * A reference to the `Element` being observed.
     */
    readonly target: Element,
    
    /**
     * Current `scrollWidth` of the element.
     */
    readonly scrollWidth: number,
    
    /**
     * Current `scrollHeight` of the element.
     */
    readonly scrollHeight: number,
    
    /**
     * Previous `scrollWidth` of the element.
     */
    readonly previousScrollWidth: number,
    
    /**
     * Previous `scrollHeight` of the element.
     */
    readonly previousScrollHeight: number,
  ) {}
}

/**
 * Options for configuring the behavior of the `ScrollSizeObserver`.
 */
export interface ScrollSizeObserverOptions {
  /**
   * Whether to observe target's horizontal scroll size (`scrollWidth` property).
   * 
   * @defaultValue true
   */
  scrollWidth?: boolean
  
  /**
   * Whether to observe target's vertical scroll size (`scrollHeight` property).
   * 
   * @defaultValue true
   */
  scrollHeight?: boolean
}

/**
 * The function called whenever an observed scroll size change occurs.
 * 
 * @param  entries - An array of `ScrollSizeObserverEntry` objects that can be
 * used to access the new scroll sizes of the element after each change.
 * @param  observer - A reference to the `ScrollSizeObserver` itself.
 */
export type ScrollSizeObserverCallback = (
  entries: ScrollSizeObserverEntry[],
  observer: ScrollSizeObserver
) => void

/**
 * Reports changes to the scroll size(s) of specified `Element`(s)
 */
export class ScrollSizeObserver {
  
  private resizeObserver = new ResizeObserver(entries => {
    this.checkChange(entries.map(entry => entry.target.parentElement as Element))
  })
  
  private mutationObserver = new MutationObserver(records => {
    let shouldCallCheckChange = true
    
    for (const record of records) {
      if (record.type !== 'childList') continue
      
      for (const addedNode of record.addedNodes) {
        if (!(addedNode instanceof Element)) continue
        
        this.resizeObserver.observe(addedNode)
        
        shouldCallCheckChange = false
      }
      
      for (const removedNode of record.removedNodes) {
        if (!(removedNode instanceof Element)) continue
        
        this.resizeObserver.unobserve(removedNode)
      }
    }
    
    if (shouldCallCheckChange) {
      this.checkChange(records.map(record => record.target as Element))
    }
  })
  
  private observations = new Map<Element, {
    observeScrollWidth: boolean
    observeScrollHeight: boolean
    previousScrollWidth: number
    previousScrollHeight: number
  }>()
  
  /**
   * Creates and returns a new `ScrollSizeObserver` object.
   * 
   * @param callback The function called whenever an observed scroll size change occurs.
   */
  constructor(private callback: ScrollSizeObserverCallback) {}
  
  /**
   * Starts observing the specified `Element`.
   * 
   * @param target - A reference to an `Element` to be observed.
   * @param options - An options object allowing you to set options for
   * the observation.
   */
  observe(target: Element, options: ScrollSizeObserverOptions = {}) {
    const {
      scrollWidth: observeScrollWidth = true,
      scrollHeight: observeScrollHeight = true,
    } = options
    
    for (const child of target.children) {
      this.resizeObserver.observe(child)
    }
    
    this.mutationObserver.observe(target, { childList: true })
    
    const { scrollWidth, scrollHeight } = target
    this.observations.set(target, {
      observeScrollWidth,
      observeScrollHeight,
      previousScrollWidth: scrollWidth,
      previousScrollHeight: scrollHeight,
    })
    
    const entry = new ScrollSizeObserverEntry(
      target,
      scrollWidth,
      scrollHeight,
      scrollWidth,
      scrollHeight,
    )
    this.callback([Object.freeze(entry)], this)
  }
  
  /**
   * Ends the observing of a specified `Element`.
   * 
   * @param target - A reference to an `Element` to be unobserved.
   */
  unobserve(target: Element) {
    const observation = this.observations.get(target)
    if (!observation) return
    
    for (const child of target.children) {
      this.resizeObserver.unobserve(child)
    }
    
    this.observations.delete(target)
    
    this.mutationObserver.disconnect()
    for (const target of this.observations.keys()) {
      this.mutationObserver.observe(target)
    }
  }
  
  /**
   * Unobserves all observed `Element` targets.
   */
  disconnect() {
    for (const target of this.observations.keys()) {
      this.observations.delete(target)
    }
    
    this.mutationObserver.disconnect()
    this.resizeObserver.disconnect()
  }
  
  private checkChange(targets: Element[]) {
    targets = [...new Set(targets)]
    
    const entries: ScrollSizeObserverEntry[] = []
    
    for (const target of targets) {
      const observation = this.observations.get(target)
      if (!observation) continue
      
      const {
        observeScrollWidth,
        observeScrollHeight,
        previousScrollWidth,
        previousScrollHeight,
      } = observation
      
      const { scrollWidth, scrollHeight } = target
      
      const scrollWidthChanged = previousScrollWidth !== scrollWidth
      const scrollHeightChanged = previousScrollHeight !== scrollHeight
      
      observation.previousScrollWidth = scrollWidth
      observation.previousScrollHeight = scrollHeight
      
      if (
        (observeScrollWidth && scrollWidthChanged) ||
        (observeScrollHeight && scrollHeightChanged)
      ) {
        const entry = new ScrollSizeObserverEntry(
          target,
          scrollWidth,
          scrollHeight,
          previousScrollWidth,
          previousScrollHeight,
        )
        entries.push(Object.freeze(entry))
      }
    }
    
    if (entries.length) {
      this.callback(entries, this)
    }
  }
}
