interface TreeObject<T> {
  children?: T[]
  [key: string]: any
}

interface FindTreePathOptions<T> {
  data: T[]
  valueProp: string
  labelProp: string
}

export function findTreePathByKey<T extends TreeObject<T>>(options: FindTreePathOptions<T> & { key: string }) {
  let findOut = false
  const paths: T[] = []

  const findAction = (item: T) => {
    if (!findOut) {
      paths.push(item)

      if (item[options.valueProp] === options.key) {
        findOut = true
        return
      }

      if (item.children?.length) {
        item.children.forEach(findAction)
      }

      if (!findOut) {
        paths.pop()
      }
    }
  }

  options.data.forEach(findAction)

  return paths
}

export function findTreePathByKeyPath<T extends TreeObject<T>>(options: FindTreePathOptions<T> & { path: string[] }) {
  let list: T[] = options.data
  const paths: T[] = []

  options.path.forEach((item) => {
    const target = list.find(x => x[options.valueProp] === item)

    if (target) {
      paths.push(target)
    }

    if (target && target.children?.length) {
      list = target.children
    }
  })

  return paths
}
