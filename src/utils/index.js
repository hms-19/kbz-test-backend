exports.getRandomNumbers = () => {
    let numbers = '';
  
    for (let i = 0; i < 6; i++) {
      let number = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
  
      numbers += number
    }
  
    return numbers;
}

exports.validationResponse = (error) => {
    const errors = error.details.map(detail => {
        return {
            path: detail?.path[0],
            message: detail?.message
        }
    })

    return errors
}