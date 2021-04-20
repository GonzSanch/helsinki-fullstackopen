import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

const blog = {
    title: 'Blog testing',
    author: 'Tester',
    likes: 5,
    url: 'local',
    user: {
        name: 'test'
    }
}

describe('<Blog />', () => {
    test('renders content only titlte and author', () => {
        const component = render(
            <Blog blog={blog} />
        )

        const div = component.container.querySelector('.blog')
        //console.log(prettyDOM(div))

        expect(component.container).toHaveTextContent('Blog testing')
        expect(div).toHaveTextContent('Tester')
    })

    test('renders all the data after fire button view', () => {
        const component = render(
            <Blog blog={blog} />
        )

        const button = component.getByText('view')
        fireEvent.click(button)

        const div = component.container.querySelector('.blog')
        //console.log(prettyDOM(div))

        expect(div).toHaveTextContent('local')
        expect(div).toHaveTextContent('test')
        expect(div).toHaveTextContent('5')
    })

    test('Test calls on like button', () => {
        const mockHandler = jest.fn()

        const component = render(
            <Blog blog={blog} updateBlog={mockHandler} />
        )

        const button_view = component.getByText('view')
        fireEvent.click(button_view)

        const button_like = component.getByText('like')
        expect(button_like).toBeDefined()

        fireEvent.click(button_like)
        expect(mockHandler.mock.calls).toHaveLength(1)

        fireEvent.click(button_like)
        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})
