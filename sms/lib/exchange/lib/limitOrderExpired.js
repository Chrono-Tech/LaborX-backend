module.exports = ({
  takerTokenAddress,
  takerTokenAmount,
  makerTokenAddress,
  makerTokenAmount
}) => {
  return `Your limit order have been expired:\n
  ${takerTokenAddress}: ${takerTokenAmount}\n
  ${makerTokenAddress}: ${makerTokenAmount}\n
  `
}
