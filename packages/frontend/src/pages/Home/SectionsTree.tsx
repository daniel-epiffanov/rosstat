/* eslint-disable max-len */
/* eslint-disable import/extensions */
import React, { FC, useEffect, useState } from 'react'
import axios from 'axios'
import { TreeView } from 'devextreme-react/tree-view'
import {
	Item, ItemClickEvent, ItemSelectionChangedEvent, SelectionChangedEvent,
} from 'devextreme/ui/tree_view'
import styles from './styles/SectionsTree.module.scss'
// import { MainSectionNamesQuery } from '../../../../../sharedTypes/gqlResolvers'
import { hostApi } from '../../helpers/host'
import useSectionsTreeQuery from './hooks/useSectionsTreeQuery'
import { SelectedSectionNamesHandler } from './hooks/useSelectedSectionNames'
import Error from '../../components/Error'

interface Props {
	selectedSectionNamesHandler: SelectedSectionNamesHandler
}

const SectionsTree: FC<Props> = ({ selectedSectionNamesHandler }) => {
	const { loading, error, data } = useSectionsTreeQuery()

	const onItemClick = async (e: ItemClickEvent) => {
		const itemData: Item = e.itemData
		const { node } = e
		if (itemData.items) {
			e.event?.preventDefault()
			return null
		}

		await e.component.unselectAll()

		const parentText = node?.parent?.text || ''
		const text = node?.text || ''

		selectedSectionNamesHandler(parentText, text)

		return null
	}

	const onItemSelectionChanged = async (e: ItemSelectionChangedEvent) => {
		const itemData: Item = e.itemData
		const { node } = e
		if (itemData.items) {
			await e.component.unselectAll()
			return null
		}
		const parentText = node?.parent?.text || ''
		const text = node?.text || ''

		selectedSectionNamesHandler(parentText, text)

		return null
	}

	if (loading) return <p>Загрузка разделов статистики...</p>
	if (error) {
		console.error({ error })
		return <Error message="Произошла ошибка. Мы не можем получить разделы статистики с сервера." />
	}

	return (
		<div>
			<TreeView
				items={data}
				selectByClick
				showCheckBoxesMode="normal"
				selectionMode="single"
				expandEvent="click"
				onItemSelectionChanged={onItemSelectionChanged}
			/>
		</div>
	)
}

export default SectionsTree
