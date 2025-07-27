export class Requester {
    static async get(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(response);
        }

        const result = await response.json();

        return result?.data || result;
    }

    static async post(url, body) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(response);
        }

        const result = await response.json();

        return result?.data || result;
    }

    static async patch(url, body) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(response);
        }

        const result = await response.json();

        return result?.data || result;
    }

    static async delete(url) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(response);
        }

        const result = await response.json();

        return result?.data || result;
    }
}