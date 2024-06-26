import mimeTypes from 'mime-types'
import { writeFile, rm, mkdir } from 'fs/promises'
/**
 * @returns mime type
 * @prop fileNameOrIdLength: you can pass a string or a number, if you enter a string it will be the file name, if you enter a number it will generate a unique ID
 */
export const storeFileLocally = async (
	dataurl: string,
	fileNameOrIdLength: string | number,
	filelocation: string = '',
): Promise<string> => {
	const arr: string[] = dataurl.split(',')
	const mimeMatch = arr[0].match(/:(.*?);/)
	if (!mimeMatch) {
		throw new Error('Invalid data URL')
	}
	const mime: string = mimeMatch[1]
	const base64String: string = arr[1]
	const binaryString: Buffer = Buffer.from(base64String, 'base64')

	const ext = mimeTypes.extension(mime)

	const location = useRuntimeConfig().public.nitroStorage.mount

	const filename =
		typeof fileNameOrIdLength == 'number'
			? generateRandomId(fileNameOrIdLength)
			: fileNameOrIdLength

	await mkdir(`${location}${filelocation}`, { recursive: true })

	await writeFile(`${location}${filelocation}/${filename}.${ext}`, binaryString, {
		flag: 'w',
	})
	return `${filename}.${ext}`
}

export const deleteFile = async (filename: string, filelocation: string = '') => {
	const location = useRuntimeConfig().public.nitroStorage.mount
	await rm(`${location}${filelocation}/${filename}`)
}

const generateRandomId = (length: number) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let randomId = ''
	for (let i = 0; i < length; i++) {
		randomId += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return randomId
}