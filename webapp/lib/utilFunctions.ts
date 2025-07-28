const formatCurrency = (priceString: string) => {

     const priceNumber = parseFloat(priceString)

     if (isNaN(priceNumber)) {
          return 'Invalid Price'
     }

     return priceNumber.toFixed(2)
}

export { formatCurrency }