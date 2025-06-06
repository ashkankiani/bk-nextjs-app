import {bkRequest} from "@/api/api";

export const hookSendGateway = async (data, callback) => {
  try {
    const res = await bkRequest.post('/user/gateway', data);
    if (res.status === 200) {
      callback(true, res.data);
    } else if (res.status === 201) {
      callback(false, res.data);
    } else {
      callback(false, res.data.error);
    }
  } catch (error) {
    console.log('error in hookSendGateway: ' + error.message);
    callback(false, error.message);
  }
}
