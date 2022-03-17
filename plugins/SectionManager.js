/* eslint-disable */
export default class SectionManager {
  constructor({state, containerWidth, itemPadding, containerHeight, scrollPosition, offsetTop, startGrid}) {
    this._state = state || this.init({containerWidth, itemPadding, containerHeight, scrollPosition, offsetTop, startGrid})
    this._containerBuffer = 200
  }

  get state () {
    return this._state
  }

  set isFirst (is) {
    this._state.isFirst = is
  }

  get isFirst () {
    return this._state.isFirst
  }

  set viewPortEed (end) {
    this._state.delta.viewPort.end = end
  }

  viewPortFromTo (pIsToTop, pScrollY, total) {
    if (total === 0) return
    // 스크롤을 변경 하였으면 state에 상태값을 저장하자
    let state = this._state
    let lDelta = state.delta
    let lOffTopTemp
    if (pScrollY < 0) { // 바운스시 -값에 대한 보정을 0으로 처리한다.
      pScrollY = 0
    }
    lOffTopTemp = pScrollY  - state.offsetTop
    if (lOffTopTemp < 0) {
      lOffTopTemp = 0
    }

    // if (pScrollY <= this._offsetTop) {  // pScrollY <= this.offsetTop 인경우 절대값으로 보정처리한다.
    //   lOffTopTemp = Math.abs(pScrollY - this._offsetTop)
    // } else {
    //   lOffTopTemp = pScrollY - this._offsetTop
    // }
    // lOffTopTemp = pScrollY - this._offsetTop
    let lViewTop = lOffTopTemp
    let lViewBottom = lViewTop + state.containerHeight + this._containerBuffer
    let lGrow = state.grow
    let lItemList = state.delta.keeper
    let lTargetList = []
    let lGridLoopCount = 0
    let inItemTop
    let inItemBottom
    let inCondition1
    let inCondition2
    let inCondition
    if (lViewTop <= -1) return false

    // console.clear()
    if (pIsToTop) {
      let end = lDelta.viewPort.end
      for (let i = end; i >= 0; --i) {
        // console.log(i)
        inItemTop = lItemList[i].top
        inItemBottom = inItemTop + lItemList[i].height

        inCondition1 = (inItemBottom >= lViewTop)
        inCondition2 = (inItemTop <= lViewBottom)
        inCondition = (inCondition1 && inCondition2)

        // console.log('serViewPort', lViewTop, inItemBottom, inCondition)
        if (inItemBottom < lViewTop) {
          break
        }
        if (inCondition) {
          lTargetList.push(i)
        }
      }
    } else {
      let start = lDelta.viewPort.start
      for (let i = start, endi = lItemList.length; i < endi; ++i) {
        // console.log(i)
        inItemTop = lItemList[i].top
        inItemBottom = inItemTop + lItemList[i].height

        inCondition1 = (inItemBottom >= lViewTop)
        inCondition2 = (inItemTop <= lViewBottom)
        inCondition = (inCondition1 && inCondition2)

        // console.log('serViewPort', lViewTop, inItemBottom, inCondition)
        if (inItemBottom < lViewTop) {
          continue
        }
        if (inCondition) {
          lTargetList.push(i)
        } else {
          lGridLoopCount++
          if (lGridLoopCount >= lGrow.length) {
            break
          }
        }
      }
    }
    // console.log(lTargetList)
    if (lTargetList.length > 0) {
      let start = Math.min(...lTargetList)
      let end = Math.max(...lTargetList)
      lDelta.viewPort.start = Math.max(0, start - state.startGrid - 1)
      lDelta.viewPort.end = Math.min(total - 1, end + (state.startGrid * 2) + 3)
      return {start: lDelta.viewPort.start, end: lDelta.viewPort.end}
    }
    return null
  }

  /** initData **/
  init ({containerWidth, itemPadding, containerHeight, scrollPosition, offsetTop, startGrid}) {
    let waterfall = this.waterfallInit(containerWidth, itemPadding, startGrid)
    let obj = {
      tops: null,
      style: {
        height: '0',
        overflow: ''
      },
      scrollPosition: scrollPosition,
      beforeScrollTop: 0,
      grow: waterfall.grow,
      isFirst: true,
      itemWidth: waterfall.itemWidth,
      delta: {
        keeper: [],
        viewPort: {
          start: 0,
          end: 1
        }
      },
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      itemPadding: itemPadding,
      offsetTop: offsetTop,
      startGrid: startGrid
    }
    return obj
  }

  // 초기데이터 생성
  waterfallInit (width, pPadding, pStartGrid = 2) {
    let lRet = {}
    let lWindowWidth = width
    // 고정 그리드를 설정여부
    let lArray = ((pSize) => {
      let inArray = []
      for (let i = 0, endi = pSize; i < endi; ++i) {
        inArray.push(1)
      }
      return inArray
    })(pStartGrid)
    lRet.grow = lArray
    lRet.itemWidth = (lWindowWidth / pStartGrid) - (pPadding * 1.5)
    lRet.itemPadding = pPadding
    return lRet
  }

  arrayFillWith (item, count) {
    let arr = []
    for (let i = 0; i < count; i++) {
      arr[i] = (typeof item === 'function') ? item() : item
    }
    return arr
  }

  sum (arr) {
    return arr.reduce((sum, val) => sum + val)
  }

  calculate (metas) {
    let state = this._state
    let width = state.containerWidth
    let grow = state.grow
    let strategy = this.rowStrategyWithGrow(width, grow, state.itemPadding)
    let keeper = state.delta.keeper
    let tops = state.tops ? state.tops : this.arrayFillWith(0, strategy.count)
    metas.forEach((meta, index) => {
      let rect = {}
      if (!keeper[meta.vm.order]) {
        let offset
        if (meta.isWholeGrid) {
          offset = tops.reduce((last, top, i) => top > tops[last] ? i : last, 0)
          rect.top = tops[offset]
          rect.left = 0
          tops = _.fill(tops, rect.top + meta.height)
        } else {
          offset = tops.reduce((last, top, i) => top < tops[last] ? i : last, 0)
          rect.top = tops[offset]
          tops[offset] = rect.top + meta.height
          rect.left = (() => {
            let inRet
            if (offset === 0) {
              inRet = strategy.left + state.itemPadding
            } else {
              inRet = strategy.left + (offset ? this.sum(strategy.width.slice(0, offset)) : 0) + (state.itemPadding * (offset + 1))
            }
            return inRet
          })()
        }
        rect.width = meta.width
        rect.height = meta.height
        Object.assign(meta.node.style, this.buildStyle(rect))

        keeper.push(rect)
        // console.log( this.buildStyle(rect))
        state.tops = tops
      } else {
        meta.vm.style = this.buildStyle(keeper[meta.vm.order])
      }
    })

    // console.error(keeper.length)
    state.style.height = Math.max.apply(Math, state.tops)
  }

  buildStyle (rect) {
    return {
      top: 0,
      left: 0,
      width: rect.width + 'px',
      height: rect.height + 'px',
      transform: `translateX(${rect.left}px) translateY(${rect.top}px)`,
      WebkitTransform: `translateX(${rect.left}px) translateY(${rect.top}px)`,
      opacity: 1
    }
  }

  rowStrategyWithGrow (width, grow, itemPadding) {
    let total = this.sum(grow)
    return {
      width: grow.map(val => (width - (itemPadding * (total + 1))) / total),
      count: grow.length,
      left: 0
    }
  }

  get itemWidth () {
    let obj = this.rowStrategyWithGrow(this._state.containerWidth, this._state.grow, this._state.itemPadding)
    return obj.width[0]
  }

}
