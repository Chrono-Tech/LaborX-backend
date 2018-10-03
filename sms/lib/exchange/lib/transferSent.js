module.exports = ({
  tokenAddress,
  amount
}) => {
  return `You sent tokens:\n
  tokenAddress: ${tokenAddress}\n
  amount: ${amount}
  `
}
