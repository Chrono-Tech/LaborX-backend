module.exports = ({
  takerTokenAddress,
  takerTokenAmount,
  makerTokenAddress,
  makerTokenAmount
}) => {
  return `Your limit order have been filled:\n
  ${takerTokenAddress}: ${takerTokenAmount}\n
  ${makerTokenAddress}: ${makerTokenAmount}\n
  `
}
