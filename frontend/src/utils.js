export function extractErrorMessage(error) {
  return error?.response?.data?.message || 
         error?.message ||
         'Something went wrong';
}

export async function handleAsync(func, ...args){
    try {
        const response = await func(...args);
        return [response, null]
    } catch (e){
        return [null, e]
    }
}

export function createConfig({token} = {}){
    const config = {
        headers: {
          'Content-Type': 'application/json',
        },
    };

    if(token){
        config.headers.Authorization = token;
    }

    return config;
}