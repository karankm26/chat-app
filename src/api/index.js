import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const loginApi = async (body) => {
  const response = await axios
    .post(`${apiUrl}/user/login`, body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const registerApi = async (body) => {
  const response = await axios
    .post(`${apiUrl}/user/register`, body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const userApi = async (id) => {
  const response = await axios
    .get(`${apiUrl}/user/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const userUpdateApi = async (data) => {
  const response = await axios
    .put(`${apiUrl}/user/${data.id}`, data.body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const userAllApi = async () => {
  const response = await axios
    .get(`${apiUrl}/user/all`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const groupApi = async () => {
  const response = await axios
    .get(`${apiUrl}/group`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const groupMessageApi = async (id) => {
  const response = await axios
    .get(`${apiUrl}/group/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const messageApi = async (data) => {
  const response = await axios
    .get(`${apiUrl}/messages/${data.sender}/${data.receiver}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const messagePostApi = async (body) => {
  const response = await axios
    .post(`${apiUrl}/messages`, body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};
const messageUpdateApi = async (data) => {
  const response = await axios
    .put(`${apiUrl}/messages/${data.id}`, data.body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};
const messageDeleteApi = async (data) => {
  const response = await axios
    .delete(`${apiUrl}/messages/${data.id}`, data.body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};

const messageAllDeleteApi = async (data) => {
  const response = await axios
    .delete(`${apiUrl}/messages/${data.sender}/${data.receiver}`, data.body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
  return response;
};
export {
  loginApi,
  registerApi,
  userApi,
  userUpdateApi,
  userAllApi,
  groupApi,
  groupMessageApi,
  messageApi,
  messagePostApi,
  messageUpdateApi,
  messageDeleteApi,
  messageAllDeleteApi,
};
