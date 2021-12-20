export const getComments = async () => {
	return [
		{
			id: "1",
			body: "Excelente sitio para visitar con amigos y familia!",
			username: "DavidPerez15",
			userId: "1",
			parentId: null,
			createdAt: "2021-12-08T23:00:33.010+02:00"
		},
		{
			id: "2",
			body: " Recomendado, aunque a ciertas horas suele estar muy concurrido ",
			username: "mariagonz6",
			userId: "2",
			parentId: null,
			createdAt: "2021-12-10T23:00:33.010+02:00"
		},
		{
			id: "3",
			body: "Bueno saberlo :)",
			username: "erickdc",
			userId: "2",
			parentId: "1",
			createdAt: "2021-12-15T23:00:33.010+02:00"
		},
		{
			id: "4",
			body: "Cual sería el mejor horario para ir a visitar?",
			username: "john209",
			userId: "2",
			parentId: "2",
			createdAt: "2021-12-18T23:00:33.010+02:00"
		}
	];
};

export const createComment = async (text, parentId = null) => {
	return {
		id: Math.random()
			.toString(36)
			.substr(2, 9),
		body: text,
		parentId,
		userId: "1",
		username: "John",
		createdAt: new Date().toISOString()
	};
};

export const updateComment = async text => {
	return { text };
};

export const deleteComment = async () => {
	return {};
};
