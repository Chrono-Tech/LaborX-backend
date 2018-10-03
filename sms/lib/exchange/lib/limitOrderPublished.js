module.exports = ({
  takerTokenAddress,
  takerTokenAmount,
  makerTokenAddress,
  makerTokenAmount
}) => {
  return `You place limit order have:\n
  ${takerTokenAddress}: ${takerTokenAmount}\n
  ${makerTokenAddress}: ${makerTokenAmount}\n
  `
}
