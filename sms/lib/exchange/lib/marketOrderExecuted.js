module.exports = ({
  takerTokenAddress,
  takerTokenAmount,
  makerTokenAddress,
  makerTokenAmount
}) => {
  return `Your marked order executed:\n
  ${takerTokenAddress}: ${takerTokenAmount}\n
  ${makerTokenAddress}: ${makerTokenAmount}\n
  `
}
