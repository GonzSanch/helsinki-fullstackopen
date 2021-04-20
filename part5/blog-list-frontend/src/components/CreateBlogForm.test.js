import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateBlogForm from './CreateBlogForm'

describe('<CreateBlogFrom />', () => {

    test('updates states and calls onSubmit with proper props', () => {
        const createBlog = jest.fn()

        const component = render(
            <CreateBlogForm createBlog={createBlog} message={null}/>
        )

        const input_title = component.container.querySelector('form div:nth-child(1) input')
        const input_author = component.container.querySelector('form div:nth-child(2) input')
        const input_url = component.container.querySelector('form div:nth-child(3) input')
        const form = component.container.querySelector('form')

        fireEvent.change(input_title, {
            target: { value: 'test form create' }
        })
        fireEvent.change(input_author, {
            target: { value: 'Jest' }
        })
        fireEvent.change(input_url, {
            target: { value: 'localtest' }
        })
        fireEvent.submit(form)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0].title).toBe('test form create')
        expect(createBlog.mock.calls[0][0].author).toBe('Jest')
        expect(createBlog.mock.calls[0][0].url).toBe('localtest')
    })

})
